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

interface ReceiptEmailProps {
  name: string;
  amount: number;
  currency: string;
  items: { title: string; price: number; quantity: number }[];
  receiptUrl?: string;
}

export const ReceiptEmail = ({ 
  name = 'Client', 
  amount = 0, 
  currency = 'usd',
  items = [],
  receiptUrl = '#'
}: ReceiptEmailProps) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  return (
    <Html>
      <Head />
      <Preview>Your Receipt from N3xUs Konc3pt'z</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>N3xUs Konc3pt'z</Heading>
            <Text style={subh1}>Payment Receipt</Text>
          </Section>
          
          <Section style={content}>
            <Text style={greeting}>Hello {name},</Text>
            <Text style={text}>
              Thank you for your business. We have successfully received your payment of <strong>{formattedAmount}</strong>.
            </Text>
            
            <Section style={invoiceTable}>
              {items.map((item, i) => (
                <div key={i} style={itemRow}>
                  <Text style={itemName}>{item.quantity}x {item.title}</Text>
                  <Text style={itemPrice}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format((item.price * item.quantity) / 100)}
                  </Text>
                </div>
              ))}
              <Hr style={hr} />
              <div style={totalRow}>
                <Text style={totalLabel}>Total</Text>
                <Text style={totalAmountText}>{formattedAmount}</Text>
              </div>
            </Section>
            
            <Section style={btnContainer}>
              <Button style={button} href={receiptUrl}>
                Download Receipt
              </Button>
            </Section>
            
            <Text style={text}>
              You can access your purchased files or view invoice details in your client dashboard.
            </Text>
            <Section style={btnContainer}>
              <Button style={buttonSecondary} href="https://n3xuskonceptz.com/dashboard">
                Go to Dashboard
              </Button>
            </Section>
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
};

export default ReceiptEmail;

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

const invoiceTable = {
  backgroundColor: '#0f0f2a',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid rgba(255,255,255,0.05)',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '10px 0',
};

const itemName = {
  color: '#e8e8f0',
  margin: '0',
};

const itemPrice = {
  color: '#e8e8f0',
  margin: '0',
  fontWeight: 'bold',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '10px',
};

const totalLabel = {
  color: '#00f0ff',
  margin: '0',
  fontSize: '18px',
  fontWeight: 'bold',
};

const totalAmountText = {
  color: '#00f0ff',
  margin: '0',
  fontSize: '18px',
  fontWeight: 'bold',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '20px 0',
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

const buttonSecondary = {
  backgroundColor: 'transparent',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '4px',
  color: '#e8e8f0',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  margin: '0 auto',
  padding: '12px',
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
