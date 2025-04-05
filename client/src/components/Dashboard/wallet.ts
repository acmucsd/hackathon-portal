'use server';

import { getCookie } from '@/lib/services/CookieService';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getErrorMessage } from '@/lib/utils';
import {
  GenericClient,
  GenericClass,
  GenericObject,
  BarcodeTypeEnum,
} from 'google-wallet/lib/esm/generic';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '{}'
);
const ISSUER_ID = process.env.ISSUER_ID ?? '';

export async function addToGoogleWallet(baseUrl: string): Promise<string> {
  let url;
  try {
    const user: PrivateProfile = JSON.parse(await getCookie(CookieType.USER));

    const client = new GenericClient(GOOGLE_APPLICATION_CREDENTIALS);

    const classPrefix = 'diamondhacks2025';
    const classId = `${ISSUER_ID}.${classPrefix}`;
    const classData: GenericClass = { id: classId };

    let genericClass = await client.getClass(ISSUER_ID, classPrefix);
    if (!genericClass) {
      genericClass = await client.createClass(classData);
    } else {
      genericClass = await client.patchClass(classData);
    }

    const objectSuffix = user.id;
    const objectId = `${ISSUER_ID}.${objectSuffix}`;
    const objectData: GenericObject = {
      id: objectId,
      classId,
      logo: { sourceUri: { uri: `${baseUrl}/assets/google-wallet-icon.png` } },
      cardTitle: { defaultValue: { language: 'en', value: 'DiamondHacks 2025' } },
      subheader: { defaultValue: { language: 'en', value: 'Hacker' } },
      header: { defaultValue: { language: 'en', value: `${user.firstName} ${user.lastName}` } },
      barcode: {
        type: BarcodeTypeEnum.QR_CODE,
        value: user.id,
      },
      hexBackgroundColor: '#151625',
      heroImage: { sourceUri: { uri: `${baseUrl}/assets/google-wallet-hero.png` } },
    };
    console.log(objectData);
    let genericObject = await client.getObject(ISSUER_ID, objectSuffix);
    if (!genericObject) {
      genericObject = await client.createObject(objectData);
    } else {
      genericObject = await client.patchObject(objectData);
    }

    const token = jwt.sign(
      {
        iss: GOOGLE_APPLICATION_CREDENTIALS.client_email,
        aud: 'google',
        origins: [],
        typ: 'savetowallet',
        payload: {
          genericObjects: [genericObject],
        },
      },
      GOOGLE_APPLICATION_CREDENTIALS.private_key,
      {
        algorithm: 'RS256',
      }
    );
    url = `https://pay.google.com/gp/v/save/${token}`;
  } catch (error) {
    return getErrorMessage(error);
  }
  redirect(url);
}
