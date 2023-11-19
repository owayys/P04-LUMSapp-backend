-> `npm run dev` <-

# DB Setup

```
mysql -u username -p -h localhost LUMSapp < currSchema.sql
```

OR

```
> mysql -u root -p

mysql> create database LUMSapp;
mysql> use LUMSapp;
mysql> source currSchema.sql;
```

# Endpoints

## Auth

-   ### Signup: /api/user/signup

    e.g.,

    ```
    {
        "name": "Name",
        "email": "24100290@lums.edu.pk",
        "password": "yo124",
        "type": "STUDENT" OR "COUNCIL" OR "SOCIETY" OR "ADMIN"
    }
    ```

    -   returns code 200, JWT on success
    -   else error

-   ### Login: /api/user/login
    e.g.,
    ```
    {
        "email": "24100290@lums.edu.pk",
        "password": "yo124"
    }
    ```
    -   returns code 200, JWT on success
    -   returns code 401 on incorrect details
    -   else error

## Post

-   ### Get: /api/post/get

    e.g.,

    ```
    {
        "postID": {PostID}
    }
    Headers: {
        Authorization: {JWT}
    }
    ```

    -   returns code 200, Post object on success
    -   else error

-   ### Feed: /api/post/feed

    e.g.,

    ```
    {
        "postLimit": {Number of Posts you want}
    }
    Headers: {
        Authorization: {JWT}
    }
    ```

    -   returns code 200, Posts on success
    -   else error

-   ### Create: /api/post/create

    -   #### New Post:

        e.g.,

        ```
        {
            "masterID": null,
            "parentID": null,
            "userID": {User Roll Number},
            "content": {Post content},
            "timePosted": "2023-11-11 15:30:00",
            "media": [] <- String array of links
        }
        Headers: {
            Authorization: {JWT}
        }
        ```

        -   returns code 200, PostID on success
        -   else error

    -   ### Comment:

        e.g.,

        ```
        {
            "masterID": {PostID},
            "parentID": {PostID},
            "userID": {User Roll Number},
            "content": {Post content},
            "timePosted": "2023-11-11 15:40:00"
            "media": [] <- String array of links
        }
        Headers: {
            Authorization: {JWT}
        }
        ```

        -   returns code 200, PostID on success
        -   else error

    -   ### Comment on comment:
        e.g., (Assuming the above comment's PostID is 1)
        ```
        {
            "masterID": {PostID (Original Post)},
            "parentID": {PostID (First Comment)},
            "userID": {User Roll Number},
            "content": {Post content},
            "timePosted": "2023-11-11 15:50:00"
            "media": [] <- String array of links
        }
        Headers: {
            Authorization: {JWT}
        }
        ```
        -   returns code 200 on success
        -   else error

-   ### Delete: /api/post/delete

    e.g., (Assuming the above comment's PostID is 1)

    ```
    {
        "postID": {PostID}
        "userID": {User Roll Number}
    }
    Headers: {
        Authorization: {JWT}
    }
    ```

    -   returns code 200 on success
    -   else error

-   ### Engagement: /api/engagement/react
    e.g., (Assuming the above comment's PostID is 1)
    ```
    {
        "userID": {User Roll Number},
        "postID": {PostID},
        "type": {"LIKE" / "DISLIKE" / "BOOKMARK"}
    }
    Headers: {
        Authorization: {JWT}
    }
    ```
    -   returns code 200 on success
    -   else error
