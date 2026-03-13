import React from 'react'
import { MutatingDots } from 'react-loader-spinner';

export default function Louder() {
  return (
    <><div className='min-h-screen flex justify-center items-center'>
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#fb2c36"
        secondaryColor="#f6339a "
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
    </div>
    </>
  )
}
