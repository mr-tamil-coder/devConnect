- If we login with email and password but we not able to see the cookie in our website ..why?/?
  - Bcoz https only supports the cookie to set for that we need to allow the cors to do with extra options what it is
- Backend :

  ```javascript
  app.use(
    cors({
      options: "http://localhost:5173",
      credentials: true,
    })
  );
  ```

- so we are not in https but we can now send the data to the cookies
  - Still Cookie not working ??
    - so that we need to do frontend also..Here is the code
- Frontend :

  ```javascript
       const res= await axios.post("http://localhost:3000/auth/login",formData,withCredentials:true);

  ```

- Boom ! its working fine now..we can now able to see the token in the browser cookies.
- If you dont pass the `axios => {withCredentials:true}` then cookie will not set
  - If you done frontend the `axios => {withCredentials:true}` but **in backend you not add this line within the cors** `credentials: true` it will throw the cors error
- Above points are important to know..
  

### Redux Toolkit 
- 2 library installed 
  - redux/js-toolkit
  - react-redux
- Setup 
  - Configure store => Provider => createSlice => add reducer to store  


- Once update the data of login of the respective user to the redux..now we see the power of redux..we can access our data in any components