function Layout(props) {
    return (
        <>
        <div>
            <header>Header</header>
            <main>{props.children}</main>
            <footer>Footer</footer>
        </div>
        </>
    )
}

export default Layout