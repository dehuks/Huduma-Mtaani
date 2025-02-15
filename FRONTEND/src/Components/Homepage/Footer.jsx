import React from 'react'
import { GetInTouch, QuickLinks, socials } from '../../Constants'

const Footer = () => {
  return (
    <div className='relative mt-10 bg-Placeholder pb-2'>
      <div className='mx-5 pt-5'>
      <div className='grid md:grid-cols-3 gap-12 justify-center '>
        <div>
          <h1 className='pb-3 lg:text-4xl md:text-3xl text-xl'>Huduma Mtaani</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, natus! Nobis est nam minima magni corrupti doloremque autem expedita, enim aliquid tempore dolores consequuntur architecto quis illo, facilis, laudantium pariatur!</p>
        <div className='pt-4 flex gap-2'>
          {socials.map((social,index)=>(
            <div key={index} className='flex'>
              <div className=''>
                <p className='bg-Icon-bg rounded-full p-2  text-white'>{social.icon}</p>
              </div>
            </div>
          ))}

        </div>
        </div>
        
        <div className=''>
          <h2 className='pb-3 lg:text-3xl md:text-2xl text-lg'>Get In Touch</h2>
          <div>
            {GetInTouch.map((GetInTouch,index)=>(
              <div key={index} className='flex  items-center gap-2 pb-2'>
                {GetInTouch.icon}
                {GetInTouch.text}
              </div>

            ))}
          </div>
          </div>
        <div>
          <h2 className='pb-3 lg:text-3xl md:text-2xl text-lg'>Quick Links</h2>
          {QuickLinks.map((QuickLink,index)=>(
            <div key={index} className='pb-2'>
              {QuickLink.text}
            </div>
          ))}
          </div>
        
      </div>
      </div>
      <div className='pt-5'>
        <hr className='opacity-30'/>
        <div className='flex lg:flex-row md:flex-row sm:flex-row flex-col gap-3  justify-between pt-3 mx-5'>
          <div>
            <h1 className='md:text-md '>Huduma Mtaani &copy; {new Date().getFullYear()}</h1>
          </div>
          <div>
            <ul className='flex gap-4 md:text-md text-Sub-Headings '>
              <li> Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookies</li>
            </ul>
          </div>

        </div>
      </div>
      
    </div>
  )
}

export default Footer