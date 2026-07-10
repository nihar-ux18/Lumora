"""add user roles

Revision ID: ce1a21261984
Revises: 0fac7ce96394
Create Date: 2026-07-10 21:07:26.115494
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "ce1a21261984"
down_revision: Union[str, Sequence[str], None] = "0fac7ce96394"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


role_enum = sa.Enum("USER", "ADMIN", name="role")


def upgrade() -> None:
    """Upgrade schema."""

    # Create PostgreSQL enum type
    role_enum.create(op.get_bind(), checkfirst=True)

    # Add column with a default for existing rows
    op.add_column(
        "users",
        sa.Column(
            "role",
            role_enum,
            nullable=False,
            server_default="USER",
        ),
    )

    # Remove the default so future inserts use the SQLAlchemy model default
    op.alter_column(
        "users",
        "role",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("users", "role")

    # Drop PostgreSQL enum type
    role_enum.drop(op.get_bind(), checkfirst=True)