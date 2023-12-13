FROM python:3.10

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./backend_api /code/backend_api

COPY ./fullstack_recipe_book /code/fullstack_recipe_book

COPY ./media /code/media

COPY ./manage.py /code/manage.py

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

CMD [ "python", "manage.py", "runserver" , "127.0.0.1:8000"]