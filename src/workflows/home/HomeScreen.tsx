import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import {
    bgGradient,
    commonGradient,
    flexColumnCenter,
} from '../../../styles/common-styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { ArrowRightAlt } from '@mui/icons-material'

export default function HomeScreen() {
    const router = useRouter()
    const { data: session } = useSession()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(() => {
        if (session === null) {
            router.push('/login').then((_) => {})
        }
        // if (session) {
        //     setIsLoggedIn(true);
        // }
    }, [session])
    return (
        <Box
            sx={{
                ...bgGradient,
                ...flexColumnCenter,
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}
            >
                <Typography variant={'h1'}>
                    SureSampatti <br /> Admin portal
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                {isLoggedIn ? (
                    <Button
                        variant={'contained'}
                        sx={{
                            backgroundImage: commonGradient,
                            fontSize: '1.4rem',
                            my: 2,
                            textTransform: 'none',
                        }}
                        size={'large'}
                        endIcon={<ArrowRightAlt />}
                        onClick={() => router.push('/app')}
                    >
                        Continue to app
                    </Button>
                ) : (
                    <Button
                        variant={'contained'}
                        sx={{
                            backgroundImage: commonGradient,
                            fontSize: '1.4rem',
                            my: 4,
                            textTransform: 'none',
                        }}
                        size={'large'}
                        endIcon={<ArrowRightAlt fontSize={'large'} />}
                        onClick={() =>
                            router.push(
                                `/login?next=${encodeURIComponent('/app')}`,
                            )
                        }
                    >
                        Get started
                    </Button>
                )}
            </Box>
        </Box>
    )
}
