import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  username: string;
  resetPasswordLink: string;
}

export default function ResetPasswordEmail({
  username,
  resetPasswordLink,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Paradis password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Hi {username},</Text>

            <Text style={text}>
              We received a request to reset your Paradis password. You can set
              a new one by clicking the button below:
            </Text>

            <Button style={button} href={resetPasswordLink}>
              Reset Your Password
            </Button>

            <Text style={text}>
              If you didn’t request a password reset, you can safely ignore this
              email—your password will stay the same.
            </Text>

            <Text
              style={{
                ...text,
                marginTop: '32px',
                fontSize: '14px',
                color: '#999',
              }}
            >
              This link will expire in 10 minutes for your security.
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

const button = {
  backgroundColor: '#007ee6',
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
