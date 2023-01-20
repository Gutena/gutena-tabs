document.addEventListener( 'DOMContentLoaded', () => {
    const tabsNodeList = document.querySelectorAll( '.gutena-tabs-block' );
    
    tabsNodeList?.forEach( ( el, index ) => {
        const tabNodeList = el?.querySelectorAll( '.gutena-tabs-tab .gutena-tab-title' );

        tabNodeList?.forEach( ( el, index ) => {
            el.addEventListener( 'click', ( event ) => {
                event.preventDefault()
                setActiveTab( tabNodeList, index )
    
                let parentNode = el?.closest( '.gutena-tabs-block' );
                let tabBlockNodeList = parentNode.querySelectorAll( '.gutena-tabs-content .gutena-tab-block' );
                setActiveTab( tabBlockNodeList, index )
            } );
        } );
    } );
} );

const setActiveTab = ( element, currentIndex ) => {
    element?.forEach( ( el, index ) => {
        if ( el?.classList.contains( 'active' ) ) {
            el?.classList.remove( 'active' )
        }
        el?.classList.add( 'inactive' )
    } );

    if ( element[currentIndex]?.classList.contains( 'inactive' ) ) {
        element[currentIndex]?.classList.remove( 'inactive' )
    }
    element[currentIndex]?.classList.add( 'active' )
}