# Django server

[Hello World live route](https://enigmatic-temple-84389.herokuapp.com)

## Running Locally

1. Create a *django_env* ([Read here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/development_environment))
2. workon *django_env*
```python
workon django_env
```
3. run server 
    * linux/macOS
    ```python
    python3 manage.py runserver
    ```
    * windows  
    ```python
    py manage.py runserver
    ```


## Connect with firebase
* Get the firebase service key from project console settings for python and save it as **ServiceAccountKey.json** file in the root.
* Uncomment the code in *mytestsite/settings.py*
```python
# cred = credentials.Certificate("./ServiceAccountKey.json")
# app = firebase_admin.initialize_app(cred)
```
## Deploy to heroku
* git add -A
* git commit -m "[msg]"
* heroku create
* git push heroku master

## References

* [Django Tutorial - MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django)

