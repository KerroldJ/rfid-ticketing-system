import React from 'react'
import Image2 from '../../../src/img/foot.png'

function Footer() {
  return (
    <div>
          <p className="mt-2 text-right text-gray-800 flex items-center justify-end space-x-2">
              <span>Powered By:</span>
              <img src={Image2} alt="Footer logo" className="w-12 h-12" />
          </p>
    </div>
  )
}

export default Footer