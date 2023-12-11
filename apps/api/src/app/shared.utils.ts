export function convertPhoneNum(phoneNumber:any) {
  if (phoneNumber.startsWith("0")) {
      return phoneNumber.replace(/^0/, "+84");
  } else if (phoneNumber.length === 10) {
      return `+84${phoneNumber}`;
  } else {
      throw new Error("Invalid phone number format");
  }
}
export function nest(items: any[], id:any = '', link:any = 'pid'):any {
      if (items) {
        return items.filter((item) => item[link] == id)
          .map((item) => ({
            ...item,
            children: nest(items, item.id),
          }));
      };
}
export function getInitials(name:any):any {
    const words = name.split(' ');
    const initials = words.map((word:any) => word[0].toUpperCase()).join('');
    return initials;
}
export function convertToSlug(str:any):any {   
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[àáảạãâầấẩậẫăằắẳặẵ]/g, 'a')
    .replace(/[èéẻẹẽêềếểệễ]/g, 'e')
    .replace(/[ìíỉịĩ]/g, 'i')
    .replace(/[òóỏọõôồốổộỗơờớởợỡ]/g, 'o')
    .replace(/[ùúủụũưừứửựữ]/g, 'u')
    .replace(/[ỳýỷỵỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9-]/g, '');
}
export function GenId(length:number,onlynumber:boolean=true) {
  let result = '';
  let characters =''
  if(onlynumber)
  {
    characters = '0123456789';
  }
  else
  {
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }

  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
export function mergeNoDup(arr1:any, arr2:any, key:any) {
  const mergedArray = arr1.concat(arr2);
  const uniqueItems = mergedArray.reduce((acc:any, item:any) => {
    if (!acc[item[key]]) {
      acc[item[key]] = item;
    }
    return acc;
  }, {});
  return Object.values(uniqueItems);
}
export function dateVNPAY(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
export function sortObject(obj: Record<string, any>): Record<string, string> {
  let sorted: Record<string, string> = {};
  let str: string[] = [];
  let key: any;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
export function groupBy(data:any) {
  if(data)
  {
    return Object.values(data.reduce((result:any, currentItem:any) => {
        const group = currentItem.Nhom;
        if (!result[group]) {
            result[group] = { Nhom: group, items: [] };
        }
        result[group].items.push({ id: currentItem.id, Cauhoi: currentItem.Cauhoi,Dapan:currentItem.Dapan });
        return result;
    }, {}));
  }
  else return null
};

export function groupByfield(data:any[]) {
      const convertedData:any = {};
      data.forEach((item:any) => {
        const nhomId = item.Nhom.id;
        if (!convertedData[nhomId]) {
          convertedData[nhomId] = {
            Nhom: item.Nhom,
            children: [],
          };
        }
        const { Nhom, ...transitem } = item;
        convertedData[nhomId].children.push(transitem);
      }); 
      return Object.values(convertedData);
};

