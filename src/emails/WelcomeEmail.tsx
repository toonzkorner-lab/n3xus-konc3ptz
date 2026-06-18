import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  projectName: string;
}

export const WelcomeEmail = ({ name = 'Client', projectName = 'Your Project' }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to N3xUs Konc3pt'z</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>N3xUs Konc3pt'z</Heading>
          <Text style={subh1}>Digital Design Studio</Text>
        </Section>
        
        <Section style={content}>
          <Text style={greeting}>Hello {name},</Text>
          <Text style={text}>
            Welcome to the N3xUs ecosystem. We have successfully received your onboarding request for <strong>{projectName}</strong>.
          </Text>
          <Text style={text}>
            Our team has been notified and we are currently reviewing your project details. You can track the status of your project directly from your client dashboard.
          </Text>
          
          <Section style={btnContainer}>
            <Button style={button} href="https://n3xuskonceptz.com/dashboard">
              Go to Dashboard
            </Button>
          </Section>
          
          <Text style={text}>
            If you have any immediate questions, feel free to reply to this email or reach out to us on Discord.
          </Text>
        </Section>

        <Section style={footer}>
          <Hr style={hr} />
          <Text style={footerText}>
            © {new Date().getFullYear()} N3xUs Konc3pt'z — Where Code Meets Cosmos
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#0a0a1a',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
};

const header = {
  backgroundColor: '#1a0a2e',
  padding: '30px',
  borderRadius: '8px 8px 0 0',
  textAlign: 'center' as const,
  borderBottom: '2px solid #00f0ff',
};

const content = {
  backgroundColor: '#141432',
  padding: '30px',
  borderRadius: '0 0 8px 8px',
  border: '1px solid rgba(0,240,255,0.1)',
  borderTop: 'none',
};

const h1 = {
  color: '#00f0ff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '4px',
};

const subh1 = {
  color: '#8b5cf6',
  fontSize: '12px',
  margin: '5px 0 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '3px',
};

const greeting = {
  color: '#e8e8f0',
  fontSize: '18px',
  lineHeight: '26px',
};

const text = {
  color: '#e8e8f0',
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#00f0ff',
  borderRadius: '4px',
  color: '#0a0a1a',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  margin: '0 auto',
  padding: '12px',
  fontWeight: 'bold',
};

const hr = {
  borderColor: 'rgba(0,240,255,0.15)',
  margin: '20px 0',
};

const footer = {
  padding: '0 30px',
};

const footerText = {
  color: '#6b6b8a',
  fontSize: '12px',
  textAlign: 'center' as const,
};
