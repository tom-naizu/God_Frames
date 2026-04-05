from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'description', 'count_label', 'color_from', 'color_to']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    formatted_price = serializers.SerializerMethodField()
    formatted_original_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'category', 'category_name', 'price', 'original_price',
            'formatted_price', 'formatted_original_price', 'image', 'badge',
            'description', 'is_active', 'created_at'
        ]

    def get_formatted_price(self, obj):
        return f'₹{obj.price:,.0f}'

    def get_formatted_original_price(self, obj):
        if obj.original_price:
            return f'₹{obj.original_price:,.0f}'
        return None
