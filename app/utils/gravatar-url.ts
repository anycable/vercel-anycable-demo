import md5 from "md5";

const emailPattern = /.+@.+/;
export function getGravatarUrl(emailOrUsername: string) {
  const trimmed = emailOrUsername.trim().toLowerCase();

  if (!emailPattern.test(trimmed)) {
    return null;
  }
  const emailHash = md5(trimmed);
  return `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
}
