-> `npm run dev` <-

# Endpoints

## Auth

-   ### '/api/user/signup':
    e.g.,\
    ```
    {
        &nbsp;&nbsp;&nbsp;&nbsp;"name": "Name",
        &nbsp;&nbsp;&nbsp;&nbsp;"email": "24100290@lums.edu.pk",
        &nbsp;&nbsp;&nbsp;&nbsp;"password": "yo124",
        &nbsp;&nbsp;&nbsp;&nbsp;"type": "STUDENT" OR "COUNCIL" OR "SOCIETY" OR "ADMIN"
    }
    ```
    -   returns code 200 on success,\
    -   else error
-   ### '/api/user/login':
    e.g.,\
    ```
    {
        &nbsp;&nbsp;&nbsp;&nbsp;"email": "24100290@lums.edu.pk",
        &nbsp;&nbsp;&nbsp;&nbsp;"password": "yo124"
    }
    ```
    -   returns code 200 on success,\
    -   returns code 401 on incorrect details,\
    -   else error
