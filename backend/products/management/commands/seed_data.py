from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = 'Seed the database with initial product data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding categories...')

        categories_data = [
            {'name': 'God Frames', 'icon': 'ॐ', 'count_label': '120+ Designs',
             'description': 'Krishna, Ganesh, Durga, Shiva & more',
             'color_from': 'spiritual-400', 'color_to': 'spiritual-600'},
            {'name': 'Nature Art', 'icon': '🌿', 'count_label': '50+ Designs',
             'description': 'Trees, deer, and nature landscapes',
             'color_from': 'green-400', 'color_to': 'emerald-600'},
            {'name': 'Vastu Frames', 'icon': '🐴', 'count_label': '40+ Designs',
             'description': 'Vastu-approved running horses',
             'color_from': 'saffron-400', 'color_to': 'saffron-600'},
            {'name': 'Peacock Series', 'icon': '🦚', 'count_label': '35+ Designs',
             'description': 'Elegant peacock artwork collection',
             'color_from': 'emerald-400', 'color_to': 'teal-600'},
            {'name': 'Golden Deer', 'icon': '🦌', 'count_label': '25+ Designs',
             'description': 'Luxury golden deer artworks',
             'color_from': 'gold-400', 'color_to': 'gold-600'},
            {'name': 'Temple Art', 'icon': '🛕', 'count_label': '30+ Designs',
             'description': 'Sacred temple & gurudwara frames',
             'color_from': 'amber-400', 'color_to': 'orange-600'},
        ]

        cat_map = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            cat_map[cat.name] = cat
            status_text = 'Created' if created else 'Exists'
            self.stdout.write(f'  {status_text}: {cat.name}')

        self.stdout.write('Seeding products...')

        products_data = [
            {
                'title': 'Golden Deer Triptych',
                'category': 'Nature Art',
                'price': 2499,
                'original_price': 3999,
                'image': '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_06_43 PM.png',
                'badge': 'Bestseller',
            },
            {
                'title': 'Radha Krishna & Sacred Collection',
                'category': 'God Frames',
                'price': 1899,
                'original_price': 2999,
                'image': '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_35 PM.png',
                'badge': 'Popular',
            },
            {
                'title': 'Seven Horses Sunrise',
                'category': 'Vastu Frames',
                'price': 2199,
                'original_price': 3499,
                'image': '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_41 PM.png',
                'badge': 'Vastu Special',
            },
            {
                'title': 'Divine Deity Collection',
                'category': 'God Frames',
                'price': 1599,
                'original_price': 2499,
                'image': '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_44 PM.png',
                'badge': None,
            },
            {
                'title': 'White Peacock Elegance',
                'category': 'Peacock Series',
                'price': 2799,
                'original_price': 4499,
                'image': '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_48 PM.png',
                'badge': 'Premium',
            },
            {
                'title': 'Royal Peacock Paradise',
                'category': 'Peacock Series',
                'price': 2599,
                'original_price': 3999,
                'image': '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_50 PM.png',
                'badge': 'New Arrival',
            },
            {
                'title': 'Ganesh & Krishna Divine Set',
                'category': 'God Frames',
                'price': 1999,
                'original_price': 3199,
                'image': '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_08_02 PM.png',
                'badge': None,
            },
            {
                'title': 'Maa Durga Navratri Special',
                'category': 'God Frames',
                'price': 2299,
                'original_price': 3699,
                'image': '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_08_07 PM.png',
                'badge': 'Festive Special',
            },
        ]

        for prod_data in products_data:
            cat_name = prod_data.pop('category')
            category = cat_map.get(cat_name)
            if not category:
                self.stdout.write(self.style.WARNING(f'  Category not found: {cat_name}'))
                continue

            product, created = Product.objects.get_or_create(
                title=prod_data['title'],
                defaults={**prod_data, 'category': category}
            )
            status_text = 'Created' if created else 'Exists'
            self.stdout.write(f'  {status_text}: {product.title}')

        self.stdout.write(self.style.SUCCESS('Done! Database seeded successfully.'))
