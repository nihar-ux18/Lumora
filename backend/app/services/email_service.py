from brevo import Brevo
from brevo.transactional_emails import (SendTransacEmailRequestSender,SendTransacEmailRequestToItem,)

from app.config.settings import settings

client = Brevo(api_key=settings.brevo_api_key)


async def send_email(*,to_email: str,to_name: str,subject: str,html_content: str,) -> None:
    client.transactional_emails.send_transac_email(
        sender=SendTransacEmailRequestSender(name="Lumora",email=settings.brevo_sender_email,),
        to=[SendTransacEmailRequestToItem(email=to_email,name=to_name,)],
        subject=subject,
        html_content=html_content,
    )


async def send_verification_email(*,to_email: str,to_name: str,token: str,) -> None:
    verification_url = (
        f"http://127.0.0.1:8000/auth/verify-email?token={token}"
    )

    html = f"""
    <h2>Verify your email</h2>

    <p>Welcome to Lumora!</p>

    <p>
        Click the button below to verify your email.
    </p>

    <a href="{verification_url}">
        Verify Email
    </a>
    """

    await send_email(to_email=to_email,to_name=to_name,subject="Verify your Lumora account",html_content=html,)


async def send_password_reset_email(*,to_email: str,to_name: str,token: str,) -> None:
    reset_url = (
        f"http://127.0.0.1:8000/auth/reset-password?token={token}"
    )

    html = f"""
    <h2>Reset your password</h2>

    <p>
        Click the button below to reset your password.
    </p>

    <a href="{reset_url}">
        Reset Password
    </a>
    """

    await send_email(to_email=to_email,to_name=to_name,subject="Reset your Lumora password",html_content=html,)