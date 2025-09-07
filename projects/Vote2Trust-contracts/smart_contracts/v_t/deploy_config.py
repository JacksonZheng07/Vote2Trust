import logging

import algokit_utils

logger = logging.getLogger(__name__)


# define deployment behaviour based on supplied app spec
def deploy() -> None:
    from smart_contracts.artifacts.v_t.v_t_client import (
        Vote2TrustFactory,
    )

    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer_ = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        Vote2TrustFactory, default_sender=deployer_.address
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    if result.operation_performed in [
        algokit_utils.OperationPerformed.Create,
        algokit_utils.OperationPerformed.Replace,
    ]:
        # Fund the contract with ALGO for storage
        algorand.send.payment(
            algokit_utils.PaymentParams(
                amount=algokit_utils.AlgoAmount(algo=2),  # More ALGO for voting contract
                sender=deployer_.address,
                receiver=app_client.app_address,
            )
        )

    logger.info(
        f"Vote2Trust contract deployed at {app_client.app_address} "
        f"with app ID {app_client.app_id}"
    )
    
    # Create a sample poll for testing
    try:
        response = app_client.send.create_poll(
            title="Sample Governance Vote",
            description="Should we implement the new feature X in our protocol?",
            options='["Yes", "No", "Abstain"]',
            commit_duration=3600,  # 1 hour
            reveal_duration=3600   # 1 hour
        )
        logger.info("Sample poll created successfully")
        
        # Start registration phase
        app_client.send.start_registration()
        logger.info("Registration phase started")
        
    except Exception as e:
        logger.warning(f"Could not create sample poll: {e}")
