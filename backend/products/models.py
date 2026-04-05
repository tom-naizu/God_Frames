from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=10, blank=True, default='')
    description = models.TextField(blank=True, default='')
    count_label = models.CharField(max_length=50, blank=True, default='')
    color_from = models.CharField(max_length=50, blank=True, default='spiritual-400')
    color_to = models.CharField(max_length=50, blank=True, default='spiritual-600')
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=500, blank=True, default='')
    badge = models.CharField(max_length=50, blank=True, null=True, default=None)
    description = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def formatted_price(self):
        return f'₹{self.price:,.0f}'

    @property
    def formatted_original_price(self):
        if self.original_price:
            return f'₹{self.original_price:,.0f}'
        return None
