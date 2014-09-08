from profiles.handlers import Login, Management


url_patterns = [
    (r"api/", Login),
    (r"api/management", Management),
]