document.addEventListener( 'DOMContentLoaded', () => {
    const tabsNodeList = document.querySelectorAll( '.gutena-tabs-block' );
    tabsNodeList?.forEach( ( el, index ) => {
        const tabNodeList = el?.querySelectorAll( '.gutena-tabs-tab .gutena-tab-title' );
        tabNodeList?.forEach( ( el, index ) => {
            el.addEventListener( 'click', e => {
                e.preventDefault()
                setActiveTab( tabNodeList, index )
    
                let parentNode = el?.closest( '.gutena-tabs-block' );
                //drafts.csswg.org/selectors-4/#the-scope-pseudo : prevent select nested tab block
                let tabBlockNodeList = parentNode.querySelectorAll( ':scope > .gutena-tabs-content > .gutena-tab-block' );
                setActiveTab( tabBlockNodeList, index )
            } );
        } );

        const tabContentNodeList = el?.querySelectorAll( '.gutena-tabs-content .wp-block-button a' );
        tabContentNodeList?.forEach( ( el, index ) => {
            el.addEventListener( 'click', e => {
                const link = el?.getAttribute( 'href' );
                if ( link?.includes( '#gutenatab' ) ) {
                    e.preventDefault()

                    const tabId = parseInt( link.replace( '#gutenatab', '' ) )
                    if ( tabId ) {
                        let parentNode = el?.closest( '.gutena-tabs-block' );
                        
                        const tabNodeList = parentNode?.querySelectorAll( '.gutena-tabs-tab .gutena-tab-title' );
                        setActiveTab( tabNodeList, tabId - 1 )

                        let tabContentNodeList = parentNode.querySelectorAll( '.gutena-tabs-content .gutena-tab-block' );
                        setActiveTab( tabContentNodeList, tabId - 1)
                    }
                }
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

    if ( element[ currentIndex ]?.classList.contains( 'inactive' ) ) {
        element[ currentIndex ]?.classList.remove( 'inactive' )
    }
    element[ currentIndex ]?.classList.add( 'active' )
}