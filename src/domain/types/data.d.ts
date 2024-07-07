import { Auth } from "./auth";

declare namespace Data {
    type Filter<T> = {
      filter?: Filter & T;
      user?: Auth.Request;
    };

    type Mount<T> = {
      body?: T;
      user?: Auth.Request;
    };

    type MountById<T> = {
      id: string;
      body?: T;
      user?: Auth.Request;
    };

    type Change<T> = {
      id: string;
      body?: T;
      user?: Auth.Request;
    };

    type ChangeById = {
      id: string;
      user?: Auth.Request;
    };

}