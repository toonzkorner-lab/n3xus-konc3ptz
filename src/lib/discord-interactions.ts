import { verifyKey } from 'discord-interactions';

/**
 * Verifies that a request originated from Discord.
 *
 * @param rawBody - The raw text body of the request
 * @param signature - The X-Signature-Ed25519 header
 * @param timestamp - The X-Signature-Timestamp header
 * @param clientPublicKey - Your Discord app's public key
 * @returns boolean indicating if the request is verified
 */
export async function verifyDiscordRequest(
  rawBody: string,
  signature: string,
  timestamp: string,
  clientPublicKey: string
): Promise<boolean> {
  try {
    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      clientPublicKey
    );
    return isValidRequest;
  } catch (err) {
    return false;
  }
}
