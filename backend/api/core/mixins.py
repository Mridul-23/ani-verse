from django.db.models import Q



class GenreFilterMixin:
    def filter_by_genre(self, queryset, genre_name):
        return queryset.filter(
            Q(genre__name__iexact=genre_name) & Q(ranked__lt=1000)
        ).order_by('?').distinct()[:10]