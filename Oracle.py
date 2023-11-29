from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def oracleStatus():
    try:
        driver = webdriver.Chrome()
        driver.get('https://ocistatus.oraclecloud.com#/')
        element_id = "LAD"
        try:
            element = driver.find_element(By.ID, element_id)
            element.click()
            time.sleep(2)
        except Exception as e:
            print(f"Erro ID '{element_id}': {e}")
        table_xpath = '//table[@class="status-table table"]'
        try:
            table = driver.find_element(By.XPATH, table_xpath)
            lines = table.find_elements(By.TAG_NAME, 'tr')
            columnSP = []
            columnVH = []
            for line in lines:
                cells = line.find_elements(By.TAG_NAME, 'td')
                if len(cells) >= 2:
                    divSP = cells[0].find_element(By.XPATH, './/div')
                    imgSP = divSP.find_element(By.TAG_NAME, 'img') 
                    divVH = cells[1].find_element(By.XPATH, './/div')
                    imgVH = divVH.find_element(By.TAG_NAME, 'img')  
                    columnSP.append(imgSP.get_attribute("title"))
                    columnVH.append(imgVH.get_attribute("title"))
        except Exception as e:
            print(f"Erro: {e}")
            columnSP, columnVH = [], []
        def joinCol(thClass, values):
            try:
                thElements = driver.find_elements(By.XPATH, f'//th[@class="{thClass}"]')
                resultDict = dict(zip([th.text for th in thElements], values))
                return resultDict
            except Exception as e:
                print(f"Erro: {e}")
                return {}
        dict_SP = joinCol("left-heading", columnSP)
        dict_VH = joinCol("left-heading", columnVH)
        driver.quit()
        dictOracle = {
            "SaoPaulo": dict_SP,
            "Vinhedo": dict_VH
        }
        print(dictOracle)
    except Exception as e:
        print(f"Erro: {e}")
oracleStatus()