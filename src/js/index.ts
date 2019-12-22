export const GameMenu = () => {
    const d = document;

    d.getElementById('GameMenu').style.display = 'block';
    d.getElementById('reload').addEventListener('click', () => {
        location.reload();
    });
}