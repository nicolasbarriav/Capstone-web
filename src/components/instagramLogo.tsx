import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function InstagramLogo() {
  const INSTAGRAM_HANDLE = 'vambe.me';

  return (
    <a
      href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
      className="instagram-icon z-10"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        icon={faInstagram}
        className="instagram-icon-float"
        width="20"
        height="20"
      />
    </a>
  );
}
