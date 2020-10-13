# ChatFish

A web chat application for the course of Software Engineering.

The backend was bootstrapped with [`django-admin startproject app`](https://docs.djangoproject.com/en/2.2/ref/django-admin/).
The frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage

    docker build -t something .
	docker run --rm something

## Develop

### Structure

* __frontend/src__ Frontend with [React](https://reactjs.org/tutorial/tutorial.html).
* __frontend/.eslintrc.json__ Code style configuration with [eslint](https://eslint.org/docs/user-guide/configuring).
* __frontend/package.json__ Package manager with `npm`. `package.json` coantains plugin configurations.

* __app__ Core settings for Django.
* __meeting__ Created by `python manage.py startapp meeting`.
* __pytest.ini__ Configuration for [pytest](https://docs.pytest.org/en/latest/).
* __requirements.txt__ Package manager with `pip`.
* __requirements_dev.txt__ Package manager with `pip`, including extra tools for development.

### Tools

* `python manage.py runserver` Run this project in development mode.
* `python manage.py makemigrations` Detect changes in data schema.
* `python manage.py migrate` Apply migrations to current database.
* `pytest` Test.
* `pylint --load-plugins=pylint_django app meeting` Advanced [PEP8](https://www.python.org/dev/peps/pep-0008/) checking.

#### Tools under `frontend/`

* `npm start` Run the frontend in development mode.
* `npm run build` Builds the frontend for production to the `build` folder.
* `npm test` Test frontend.
* `npm run lint` Check code style.

## License

MIT License
