from flask import Blueprint, blueprints
from flask_marshmallow import Marshmallow
from marshmallow import fields, Schema, schema

schema_blueprint = Blueprint("schema", __name__)

ma = Marshmallow(schema_blueprint)


def get_schema_blueprint():
    return schema_blueprint


class AppSchema(Schema):
    image_file_url = fields.Str(required=False)
    image_file_path = fields.Str(required=False)

    class Meta:
        fields = ('image_file_url', 'image_file_path')
