import { DOMAIN, TOKEN } from "../utils/Config";
import Axios from "axios";

export class BaseService {
  put = (url, model) => {
    return Axios({
      url: `${DOMAIN}${url}`,
      method: "PUT",
      data: model,
      headers: { Authorization: "Bearer " + localStorage.getItem(TOKEN) },
    });
  };

  post = (url, model) => {
    return Axios({
      url: `${DOMAIN}${url}`,
      method: "POST",
      data: model,
    });
  };

  get = (url, params= null) => {
    return Axios({
      url: `${DOMAIN}${url}`,
      params: params,
      method: "GET",
    });
  };

  delete = (url) => {
    return Axios({
      url: `${DOMAIN}${url}`,
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem(TOKEN) },
    });
  };

  get_token = (url, params= null) => {
    return Axios({
      url: `${DOMAIN}${url}`,
      method: "GET",
      params: params,
      headers: { Authorization: "Bearer " + localStorage.getItem(TOKEN) },
    });
  };

  post_token = (url, model) => {
    return Axios({
      url: `${DOMAIN}${url}`,
      method: "POST",
      data: model,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem(TOKEN)} //JWT
    });
  };
}