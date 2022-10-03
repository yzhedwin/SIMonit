import React from 'react'
import { connect } from 'react-redux'

/**
 * Shows all saved Dashboard layouts
 * @param {*} props 
 * @returns 
 */
export const LayoutDrawer = (props) => {
  return (
    <div>LayoutDrawer</div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutDrawer)