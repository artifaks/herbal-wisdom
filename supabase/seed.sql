-- Seed data for herbs table
insert into public.herbs (name, scientific_name, description, benefits, category, preparation_methods, is_premium)
values
    (
        'Mistletoe',
        'Viscum album',
        'Sacred to the Celtic Druids, mistletoe was believed to have powerful healing and magical properties.',
        array['Immune system support', 'Traditional cancer support', 'Blood pressure regulation'],
        'Sacred Plants',
        array['Tincture', 'Tea', 'Ritual use'],
        true
    ),
    (
        'Vervain',
        'Verbena officinalis',
        'Known as one of the most sacred herbs to the Druids, vervain was used in ceremonies and healing rituals.',
        array['Nervous system support', 'Digestive aid', 'Headache relief'],
        'Ceremonial',
        array['Infusion', 'Tincture', 'Compress'],
        false
    ),
    (
        'Mugwort',
        'Artemisia vulgaris',
        'A herb of protection and prophetic dreams in Celtic tradition, used for divination and spiritual work.',
        array['Dream enhancement', 'Digestive support', 'Menstrual regulation'],
        'Magical',
        array['Smudging', 'Tea', 'Dream pillow'],
        false
    ),
    (
        'Bilberry',
        'Vaccinium myrtillus',
        'A Celtic healing berry known for its powerful medicinal properties, especially for eye health.',
        array['Vision support', 'Blood sugar regulation', 'Antioxidant properties'],
        'Healing',
        array['Fresh eating', 'Tea', 'Tincture', 'Jam'],
        true
    ),
    (
        'St. Johns Wort',
        'Hypericum perforatum',
        'Sacred to the Celtic sun celebrations, this herb was believed to have protective and healing properties.',
        array['Mood support', 'Wound healing', 'Nerve pain relief'],
        'Sacred Plants',
        array['Oil infusion', 'Tincture', 'Tea'],
        false
    );

-- Note: image_urls will be added through the admin interface
