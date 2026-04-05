import razorpay
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from orders.models import Order


def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    order_id = request.data.get('order_id')

    if not order_id:
        return Response({'error': 'order_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        order = Order.objects.get(pk=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    if order.payment_status == 'paid':
        return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)

    # Amount in paise (smallest currency unit)
    amount_in_paise = int(order.total * 100)

    try:
        client = get_razorpay_client()
        razorpay_order = client.order.create({
            'amount': amount_in_paise,
            'currency': 'INR',
            'receipt': f'order_{order.id}',
            'notes': {
                'order_id': str(order.id),
                'user_email': request.user.email,
            }
        })

        # Save Razorpay order ID
        order.razorpay_order_id = razorpay_order['id']
        order.save()

        return Response({
            'razorpay_order_id': razorpay_order['id'],
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,
            'amount': amount_in_paise,
            'currency': 'INR',
            'order_id': order.id,
        })

    except Exception as e:
        return Response({'error': f'Payment creation failed: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')

    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
        return Response({'error': 'Missing payment details'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        order = Order.objects.get(razorpay_order_id=razorpay_order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        client = get_razorpay_client()
        # Verify signature
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature,
        })

        # Payment verified - update order
        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.payment_status = 'paid'
        order.status = 'confirmed'
        order.save()

        return Response({
            'message': 'Payment verified successfully',
            'order_id': order.id,
            'payment_status': 'paid',
        })

    except razorpay.errors.SignatureVerificationError:
        order.payment_status = 'failed'
        order.save()
        return Response({'error': 'Payment verification failed'},
                        status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': f'Verification error: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
