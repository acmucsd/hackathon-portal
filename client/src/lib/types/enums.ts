export enum UserAccessType {
  RESTRICTED = 'RESTRICTED',
  STANDARD = 'STANDARD',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum ApplicationStatus {
  CONFIRMED = 'CONFIRMED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum ApplicationDecision {
  NO_DECISION = 'NO_DECISION',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  WAITLIST = 'WAITLIST',
}

export enum FormType {
  APPLICATION = 'APPLICATION',
  LIABILITY_WAIVER = 'LIABILITY_WAIVER',
  PHOTO_RELEASE = 'PHOTO_RELEASE',
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

export enum EventType {
  INFO = 'INFO',
  MAIN_EVENT = 'MAIN_EVENT',
  SOCIAL = 'SOCIAL',
  WORKSHOP = 'WORKSHOP',
}

export enum Day {
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}
