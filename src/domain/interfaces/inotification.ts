import { SendMassRequest, SendSingleRequest } from "../types/mail";
import { SendPushRequest } from "../types/push";

export interface INotification {
  sendMailSingle(data: SendSingleRequest): Promise<void>;
  sendMailMass(data: SendMassRequest): Promise<void>;
  sendPush(data: SendPushRequest): Promise<void>;
}