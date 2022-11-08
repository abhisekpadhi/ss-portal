import Link from 'next/link';
import Container from '@mui/material/Container';

export default function FourOhFour() {
    return (
        <Container sx={{ p: 10 }}>
            <h1>404 - Page Not Found</h1>
            <Link href="/">
                <a style={{ color: 'blue' }}>🏡 Go back home</a>
            </Link>
        </Container>
    );
}
