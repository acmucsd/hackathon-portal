export enum UserAccessType {
  RESTRICTED = 'RESTRICTED',
  STANDARD = 'STANDARD',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export enum ApplicationStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  WITHDRAWN = 'WITHDRAWN',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
}

export enum ApplicationDecision {
  NO_DECISION = 'NO_DECISION',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  WAITLIST = 'WAITLIST',
}

export enum FormType {
  APPLICATION = 'APPLICATION',
}

export enum YesOrNo {
  YES = 'YES',
  NO = 'NO',
}

export enum Yes {
  YES = 'YES',
}
export enum MediaType {
  RESUME = 'RESUME',
}

export enum CookieType {
  USER = 'USER',
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}
