from decimal import Decimal
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Cart, CartItem, Address, Order, OrderItem
from .serializers import (
    CartSerializer, AddToCartSerializer, UpdateCartItemSerializer,
    CheckoutSerializer, OrderSerializer
)
from products.models import Product


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    cart = get_or_create_cart(request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    serializer = AddToCartSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    product_id = serializer.validated_data['product_id']
    quantity = serializer.validated_data.get('quantity', 1)

    try:
        product = Product.objects.get(pk=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    cart = get_or_create_cart(request.user)

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart, product=product,
        defaults={'quantity': quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response({
        'message': f'{product.title} added to cart',
        'cart': CartSerializer(cart).data,
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    serializer = UpdateCartItemSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        cart = get_or_create_cart(request.user)
        item = CartItem.objects.get(pk=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    item.quantity = serializer.validated_data['quantity']
    item.save()

    return Response({
        'message': 'Quantity updated',
        'cart': CartSerializer(cart).data,
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    try:
        cart = get_or_create_cart(request.user)
        item = CartItem.objects.get(pk=item_id, cart=cart)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

    item.delete()
    return Response({
        'message': 'Item removed from cart',
        'cart': CartSerializer(cart).data,
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = get_or_create_cart(request.user)
    cart.items.all().delete()
    return Response({
        'message': 'Cart cleared',
        'cart': CartSerializer(cart).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    serializer = CheckoutSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    cart = get_or_create_cart(request.user)
    cart_items = cart.items.all()

    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    # Create address
    address = Address.objects.create(
        user=request.user,
        full_name=data['full_name'],
        phone=data['phone'],
        email=data['email'],
        address_line1=data['address_line1'],
        address_line2=data.get('address_line2', ''),
        city=data['city'],
        state=data['state'],
        pincode=data['pincode'],
        notes=data.get('notes', ''),
    )

    # Calculate totals
    subtotal = sum(item.subtotal for item in cart_items)
    delivery_charge = Decimal('0') if subtotal > 999 else Decimal('99')
    total = subtotal + delivery_charge

    # Create order
    order = Order.objects.create(
        user=request.user,
        address=address,
        subtotal=subtotal,
        delivery_charge=delivery_charge,
        total=total,
        payment_method=data['payment_method'],
        payment_status='pending',
    )

    # Create order items
    for cart_item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            product_title=cart_item.product.title,
            product_price=cart_item.product.price,
            product_image=cart_item.product.image,
            quantity=cart_item.quantity,
        )

    # Clear cart
    cart_items.delete()

    # If COD, mark as confirmed
    if data['payment_method'] == 'cod':
        order.status = 'confirmed'
        order.payment_status = 'pending'
        order.save()

    return Response({
        'message': 'Order placed successfully',
        'order': OrderSerializer(order).data,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_list(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    try:
        order = Order.objects.get(pk=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = OrderSerializer(order)
    return Response(serializer.data)
