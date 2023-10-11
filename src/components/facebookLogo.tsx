import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FacebookLogo() {
  const FACEBOOK_HANDLE = 'Vambe.me'; // replace with your Facebook page handle

  return (
    <a
      href={`https://facebook.com/${FACEBOOK_HANDLE}`}
      className="facebook-icon z-10"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        icon={faFacebookF}
        className="facebook-icon-float"
        width="18"
        height="18"
      />
    </a>
  );
}
