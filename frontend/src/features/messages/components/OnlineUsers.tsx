import React, {ReactNode} from 'react';
import {IUser} from "../../../types";
import {Avatar, Badge, Grid, Typography} from "@mui/material";

interface Props {
    users: IUser[]
}

function StyledBadge(_props: {
    overlap: string,
    variant: string,
    anchorOrigin: { horizontal: string; vertical: string },
    children: ReactNode
}) {
    return null;
}

const OnlineUsers: React.FC<Props> = (props) => {

    return (
        <Grid sx={{ borderRight: "3px solid black", height: '500px', width: '20%', overflowY: 'scroll'}}>
            <Grid sx={{ borderBottom: '3px solid black' }}>
                <Typography variant="h4">Online users</Typography>
            </Grid>
            {props.users.map((user) => (
                <Grid sx={{display: 'flex', margin: '20px 10px', alignItems: 'center'}} key={user._id}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar src="/broken-image.jpg" /><StyledBadge

                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </StyledBadge>

                    </Badge>
                    <Typography sx={{marginLeft: '10px'}}>{user.username}</Typography>
                </Grid>
            ))}
        </Grid>
    );
};

export default OnlineUsers;
