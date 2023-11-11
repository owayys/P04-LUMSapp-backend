-> `npm run dev` <-

# Endpoints

## Auth

-   ### '/api/user/signup':
    e.g.,
    ```
    {
        "name": "Name",
        "email": "24100290@lums.edu.pk",
        "password": "yo124",
        "type": "STUDENT" OR "COUNCIL" OR "SOCIETY" OR "ADMIN"
    }
    ```
    -   returns code 200 on success,
    -   else error
-   ### '/api/user/login':
    e.g.,
    ```
    {
        "email": "24100290@lums.edu.pk",
        "password": "yo124"
    }
    ```
    -   returns code 200 on success,
    -   returns code 401 on incorrect details,
    -   else error
