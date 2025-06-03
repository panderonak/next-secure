import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface TwoFactorEmailProps {
  username: string;
  twoFactorCode: string;
}

export default function TwoFactorCodeEmail({
  username,
  twoFactorCode,
}: TwoFactorEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Paradis verification code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Hi {username},</Text>

            <Text style={text}>
              To continue signing in to your Paradis account, please enter the
              verification code below:
            </Text>

            <Text style={code}>{twoFactorCode}</Text>

            <Text style={text}>
              If you didn’t try to sign in, you can safely ignore this email.
            </Text>

            <Text
              style={{
                ...text,
                marginTop: '32px',
                fontSize: '14px',
                color: '#999',
              }}
            >
              This code will expire in 10 minutes for your security.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
  borderRadius: '6px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontWeight: '400',
  color: '#404040',
  lineHeight: '26px',
};

const code = {
  backgroundColor: '#0a0a0a',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
  marginTop: '20px',
};
