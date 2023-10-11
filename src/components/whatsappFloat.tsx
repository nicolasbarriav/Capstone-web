import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function WhatsappLogo() {
  const PHONE_NUMBER = '+56977004478';

  return (
    <a
      href={`https://wa.me/${PHONE_NUMBER}?text=Hola!%20Necesito%20ayuda%20`}
      className="whatsapp-icon z-10"
      target="_blank"
    >
      <FontAwesomeIcon
        icon={faWhatsapp}
        className="whatsapp-icon-float"
        width="32"
        height="32"
      />
    </a>
  );
}
