import os
import random
import math
# import matplotlib.pyplot as plt
# import matplotlib.image as mpimg
from skimage.filters import threshold_otsu

import numpy as np
import cv2
from PIL import Image
from copy import deepcopy

from scipy.spatial.distance import euclidean
from imutils import perspective
from imutils import contours
import numpy as np
import imutils
import cv2
# Function to show array of images (intermediate results)
# fig = plt.figure(figsize=(15, 5))
# ax = []
# rows = 3
# columns = 3


def show_images(images):
    height = 512
    width = 512
    for i, img in enumerate(images):
        size_image = cv2.resize(img, (height, width))
        # cv2_imshow(size_image)
        # ax.append(fig.add_subplot(rows, columns, i+1))
        # im = cv2.cvtColor(size_image, cv2.COLOR_BGR2RGB)
        # plt.xticks([])
        # plt.yticks([])
        # plt.imshow(im)


def get_image(path, height=512, width=512, channels=3):
    n_inputs = height * width * channels
    img = None
    try:
        image = cv2.imread(path)
        # image_from_array = Image.fromarray(image, 'RGB')
        size_image = cv2.resize(image, (height, width))
        img = size_image.reshape(height, width, channels)
    except AttributeError as e:
        print("Error", e)
        return None
    return img


def non_max_suppression_fast(boxes, overlapThresh):
    # if there are no boxes, return an empty list
    boxes = np.array(boxes)
    if len(boxes) == 0:
        return []

    # initialize the list of picked indexes
    pick = []
    # grab the coordinates of the bounding boxes
    # print (boxes)
    x1 = boxes[:, 0, 0]
    x2 = boxes[:, 1, 0]
    y2 = boxes[:, 2, 0]
    y1 = boxes[:, 3, 0]

    # compute the area of the bounding boxes and sort the bounding
    # boxes by the bottom-right y-coordinate of the bounding box
    area = (x2 - x1 + 1) * (y2 - y1 + 1)
    idxs = np.argsort(y2)
    # keep looping while some indexes still remain in the indexes
    # list
    while len(idxs) > 0:
        # grab the last index in the indexes list and add the
        # index value to the list of picked indexes
        last = len(idxs) - 1
        i = idxs[last]
        pick.append(i)
        # find the largest (x, y) coordinates for the start of
        # the bounding box and the smallest (x, y) coordinates
        # for the end of the bounding box
        xx1 = np.maximum(x1[i], x1[idxs[:last]])
        yy1 = np.maximum(y1[i], y1[idxs[:last]])
        xx2 = np.minimum(x2[i], x2[idxs[:last]])
        yy2 = np.minimum(y2[i], y2[idxs[:last]])
        # compute the width and height of the bounding box
        w = np.maximum(0, xx2 - xx1 + 1)
        h = np.maximum(0, yy2 - yy1 + 1)
        # compute the ratio of overlap
        overlap = (w * h) / area[idxs[:last]]
        # delete all indexes from the index list that have
        idxs = np.delete(idxs, np.concatenate(([last],
                                               np.where(overlap > overlapThresh)[0])))
    # return only the bounding boxes that were picked using the
    # integer data type
    return boxes[pick], pick


def detect_roi_cnts(boxes, overlapThresh, plate_cords):
    # if there are no boxes, return an empty list
    boxes = np.array(boxes)
    if len(boxes) == 0:
        return []

    # initialize the list of picked indexes
    pick = []
    # grab the coordinates of the bounding boxes
    # print (boxes)
    # (bl, br, tr, tl)
    xpl, xpr, ypb, ypt = plate_cords[0][0], plate_cords[1][0], plate_cords[1][1], plate_cords[2][1]
    # print(boxes.shape)
    # print(plate_cords)
    # compute the area of the bounding boxes and sort the bounding
    # boxes by the bottom-right y-coordinate of the bounding box
    # print(xpl, xpr, ypb, ypt)
    for i in range(len(boxes)):
        # for the end of the bounding box
        xl, xr, yb, yt = boxes[i][0][0], boxes[i][1][0], boxes[i][1][1], boxes[i][2][1]
        area = (xr - xl + 1) * (yt - yb + 1)
        xx1 = np.maximum(xl, xpl)
        yy1 = np.maximum(yb, ypb)
        xx2 = np.minimum(xr, xpr)
        yy2 = np.minimum(yt, ypt)
        # compute the width and height of the bounding box
        w = np.maximum(0, xx2 - xx1 + 1)
        h = np.maximum(0, yy2 - yy1 + 1)
        # print(w,h,area)
        # compute the ratio of overlap
        overlap = (w * h) / area
        # print("xl: {} xr: {} yb: {} yt: {}".format(xl, xr, yb, yt))
        # print("overlap: {} w: {} h: {} area: {} xx1: {} xx2: {} yy1: {} yy2: {}".format(overlap, w, h, area, xx1, xx2, yy1, yy2))
        # print(overlap)
        if overlap >= overlapThresh:
            pick.append(i)
    # return only the bounding boxes that were picked using the
    # integer data type
    return pick


def draw_cnt_and_mark_size(cnt, image, pixel_per_cm, pixel_per_sq_cm, box_color=(0, 0, 255), font_color=(255, 255, 0)):
    box = cv2.minAreaRect(cnt)
    box = cv2.boxPoints(box)
    box = np.array(box, dtype="int")
    box = perspective.order_points(box)
    (bl, br, tr, tl) = box
    cv2.drawContours(image, [box.astype("int")], -1, box_color, 2)
    mid_pt_horizontal = (tl[0] + int(abs(tr[0] - tl[0])/2),
                         tl[1] + int(abs(tr[1] - tl[1])/2))
    mid_pt_verticle = (tr[0] + int(abs(tr[0] - br[0])/2),
                       tr[1] + int(abs(tr[1] - br[1])/2))
    wid = euclidean(tl, tr)/pixel_per_cm
    ht = euclidean(tr, br)/pixel_per_cm
    area = cv2.contourArea(cnt)/pixel_per_sq_cm
    # cv2.putText(image, "{:.1f}cm".format(wid), (int(mid_pt_horizontal[0] - 5), int(mid_pt_horizontal[1] - 5)),
    # cv2.FONT_HERSHEY_SIMPLEX, 0.5, font_color, 1)
    # cv2.putText(image, "{:.1f}cm".format(ht), (int(mid_pt_verticle[0] + 5), int(mid_pt_verticle[1])),
    # cv2.FONT_HERSHEY_SIMPLEX, 0.5, font_color, 1)
    cv2.putText(image, "{:.1f}sq.cm".format(area), (int(mid_pt_verticle[0]*1), int(mid_pt_horizontal[1]*1)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, font_color, 2)
    return image


def find_size(img_path, uid):
    img = get_image(img_path)
    image = img.copy()

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, it = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU)
    blur = cv2.GaussianBlur(it, (11, 11), 0)

    edged = cv2.Canny(blur, 50, 100)
    edged = cv2.dilate(edged, None, iterations=1)
    edged = cv2.erode(edged, None, iterations=1)
    show_images([gray, it, blur, edged])

    # Find contours
    cnts = cv2.findContours(edged.copy(), cv2.RETR_LIST,
                            cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    # Sort contours from left to right as leftmost contour is reference object
    (cnts, _) = contours.sort_contours(cnts)

    # print (cnts)
    # Remove contours which are not large enough
    cnts = [x for x in cnts if cv2.contourArea(x) > 500]

    # Reference object dimensions
    ref_object = cnts[-1]
    box = cv2.minAreaRect(ref_object)
    box = cv2.boxPoints(box)
    box = np.array(box, dtype="int")
    box = perspective.order_points(box)
    (bl, br, tr, tl) = box
    dist_in_pixel = euclidean(tl, br)
    area_in_pixel = cv2.contourArea(ref_object)
    dist_in_cm = 1.905
    area_in_cm = math.pi*(dist_in_cm**2)/4.0
    pixel_per_cm = dist_in_pixel/dist_in_cm
    pixel_per_sq_cm = area_in_pixel/area_in_cm

    # assume plate will have the maximum area
    max_area = max([cv2.contourArea(x) for x in cnts])
    # find the contours of the plate
    plate_cnt = list(filter(lambda x: cv2.contourArea(x) == max_area, cnts))
    # remove all the contours which have area closer to the area of the contours
    cnts = list(
        filter(lambda x: (((max_area - cv2.contourArea(x))/max_area) > 0.1), cnts))

    boxes = []
    plate_cnt = plate_cnt[0]
    plate_box = cv2.minAreaRect(plate_cnt)
    plate_box = cv2.boxPoints(plate_box)
    plate_box = np.array(plate_box, dtype="int")
    plate_box = perspective.order_points(plate_box)
    (p_bl, p_br, p_tr, p_tl) = plate_box
    for ref_object in cnts:
        box = cv2.minAreaRect(ref_object)
        box = cv2.boxPoints(box)
        box = np.array(box, dtype="int")
        box = perspective.order_points(box)
        (bl, br, tr, tl) = box
        boxes.append((bl, br, tr, tl))
    pick = detect_roi_cnts(boxes, 0.6, (p_bl, p_br, p_tr, p_tl))
    cnts = [cnts[idx] for idx in pick]
    boxes = [boxes[idx] for idx in pick]

    boxes, pick = non_max_suppression_fast(boxes, 0.5)
    # print(pick)
    cnt_modified = []
    for idx in pick:
        cnt_modified.append(cnts[idx])
    cnts = cnt_modified

    image = draw_cnt_and_mark_size(
        ref_object, image, pixel_per_cm, pixel_per_sq_cm, box_color=(255, 255, 255))
    image = draw_cnt_and_mark_size(
        plate_cnt, image, pixel_per_cm, pixel_per_sq_cm, box_color=(255, 0, 255))

    # Draw remaining contours
    for cnt in cnts[1:]:
        image = draw_cnt_and_mark_size(
            cnt, image, pixel_per_cm, pixel_per_sq_cm)
    filename = f"{uid}_segment.jpg"
    cv2.imwrite(f"static/{filename}", image)

    return {
        "red": 140.41,
        "blue": 72.75,
        "green": 213.51
    }, filename
    # plt.show()
