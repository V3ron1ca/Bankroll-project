import getToken from './Token'
import axios from 'axios'

export const BaseUrl = "[************* enter backend url *************]";

 export const getAuthorized = async (url, onSuccess) => {
    var token = getToken()
    if(token == null)
    {
        return
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token)
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders
    };

      let response = await fetch(BaseUrl + url, requestOptions)
      if(response.ok)
      {
        let data = await response.json()
         await onSuccess(data)
      }
  }

  export const postAuthorized = async (url, data, onSuccess, onFail = null) => {
    var token = getToken()
    if(token == null)
    {
        return
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token)
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', '*')

  

    var body = JSON.stringify(data);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: body,
      mode : "cors"
    };

      
    var response = await fetch(BaseUrl + url, requestOptions)
    let responseData = await response.json()
      if(response.ok)
      {
         await onSuccess(responseData)
      }
      else if(onFail != null)
      {
        await onFail(responseData)
      }
  }

  export const putAuthorized = async(url, data, onSuccess, onFail=null) => {
    let config = {
      headers: {
          'Authorization': 'Bearer ' + getToken(),
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
      }
  };
    const response= await axios.put(BaseUrl + url, data, config);
    console.log(response)
    if(response.status == 200)
    {
        onSuccess(response.data)
    }
    else
    {
      if(onFail != null)
      {
        onFail(response.data)
      }
    }
  }

  export const deleteAuthorized = async(url, onSuccess, onFail) => {
    let config = {
      headers: {
          'Authorization': 'Bearer ' + getToken(),
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
      }
  };

    const response = await axios.delete(BaseUrl + url, config)
    if(response.status == 200)
    {
        onSuccess(response.data)
    }
    else
    {
      if(onFail != null)
      {
        onFail(response.data)
      }
    }
  }

