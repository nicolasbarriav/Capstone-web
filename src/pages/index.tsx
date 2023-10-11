import LandingNavbar from '@/components/landingNavbar';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import HowDoesItWork from './howDoesItWork';
import IntroductionSection from './introductionSection';
import JoinUs from './JoinUs';
import Pricing from './Pricing';
import SaveTimeCard from './saveTimeCard';
import StartNowCard from './startNowCard';

const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title="Vambe: Cobro fácil de facturas y suscripciones por whatsapp/mail."
          description="Optimiza y automatiza la gestión de cuentas por cobrar en pesos chilenos y UF. Realiza cobros únicos o recurrentes y recibe notificaciones vía email y whatsapp sin complicaciones."
          canonical="https://www.vambe.cl"
        />
      }
    >
      <div className="flex flex-col justify-center bg-gray-200">
        <LandingNavbar />
        <IntroductionSection />
        <StartNowCard />
        <HowDoesItWork />
        <SaveTimeCard />
        <Pricing />
        <JoinUs />
      </div>
    </Main>
  );
};

export default Index;
