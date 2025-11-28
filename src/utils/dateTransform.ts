export const dateTransform = (date: string): string => {
    const meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const dateSplit = date.split('-');

    return `${dateSplit[2]} de ${meses[parseInt(dateSplit[1]) - 1]} de ${dateSplit[0]}`;
}