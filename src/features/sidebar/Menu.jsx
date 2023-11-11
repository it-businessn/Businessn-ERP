import { Stack } from '@chakra-ui/react'
import { NavButton } from 'components'
import { NavLink } from 'react-router-dom'

export default function Menu({path,name,icon}) {
  return (
    <NavLink to={path}>
    <Stack>
      <NavButton
        color="primary"
        label={name}
        icon={icon}
      />
    </Stack>
  </NavLink>
  )
}
