// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary'

const requestStatusState = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
}

// class ErrorBoundary extends React.Component {
  // state = { error: null }
  // 
  // static getDerivedStateFromError(error) {
    // return { error }
  // }
// 
  // render() {
    // if (this.state.error) {
      // return <this.props.FallbackComponent error={this.state.error} />
    // }
    // return this.props.children
  // }
// }

// *****************************************
// Extra credit 3
// *****************************************
function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName 
      ? requestStatusState.PENDING
      : requestStatusState.IDLE, 
    pokemon: null,
    error: ''
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    
    setState({status: requestStatusState.PENDING, error: '', pokemon: null})

    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState(state => ({...state, status: requestStatusState.RESOLVED, pokemon: pokemonData}))
      },
      error => {
        setState(state => ({...state, status: requestStatusState.REJECTED, error }))
      }
    )
  }, [pokemonName])

  if (state.status === requestStatusState.REJECTED) {
    // return (
      // <div role="alert">
        // There was an error: <pre style={{ whiteSpace: 'normal' }}>{state.error.message}</pre>
      // </div>
    // )

    // *****************************************
    // Extra credit 4
    // *****************************************
    throw state.error
  }
  if (state.status === requestStatusState.IDLE) {
    return 'Submit a pokemon'
  }
  if (state.status === requestStatusState.PENDING) {
    return <PokemonInfoFallback name={pokemonName} />
  }
  if (state.status === requestStatusState.RESOLVED) {
    return <PokemonDataView pokemon={state.pokemon} />
  }
  
  throw new Error('Something went wrong')
}

// *****************************************
// Extra credit 1-2
// *****************************************
// function PokemonInfo({pokemonName}) {
  // const [pokemon, setPokemon] = React.useState(null)
  // const [error, setError] = React.useState('')
  // const [status, setStatus] = React.useState(requestStatusState.IDLE)
// 
  // React.useEffect(() => {
    // if (!pokemonName) {
      // return
    // }
    // 
    // setPokemon(null)
    // setError('')
    // setStatus(requestStatusState.PENDING)
// 
    // fetchPokemon(pokemonName).then(
      // pokemonData => {
        // setPokemon(pokemonData)
        // setStatus(requestStatusState.RESOLVED)
      // },
      // error => {
        // setError(error)
        // setStatus(requestStatusState.REJECTED)
      // }
    // )
  // }, [pokemonName])
// 
  // if (status === requestStatusState.REJECTED) {
    // return (
      // <div role="alert">
        // There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      // </div>
    // )
  // }
  // if (status === requestStatusState.IDLE) {
    // return 'Submit a pokemon'
  // }
  // if (status === requestStatusState.PENDING) {
    // return <PokemonInfoFallback name={pokemonName} />
  // }
  // if (status === requestStatusState.RESOLVED) {
    // return <PokemonDataView pokemon={pokemon} />
  // }
  // 
  // throw new Error('Something went wrong')
// }
// 

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }
  
  function handleReset() {
    setPokemonName('')
  }

  // return (
    // <div className="pokemon-info-app">
      // <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      // <hr />
      // <div className="pokemon-info">
        // <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          // <PokemonInfo pokemonName={pokemonName} />
        // </ErrorBoundary>
      // </div>
    // </div>
  // )
  
  // *****************************************
  // Extra credit 6
  // *****************************************
  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}> */}
        <ErrorBoundary 
          FallbackComponent={ErrorFallback} 
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
